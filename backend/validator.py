from models.a2ui_schema import A2UIPayload

def validate_payload(data: dict) -> tuple[bool, list[str]]:
    try:
        A2UIPayload.model_validate(data)
        return True, []
    except Exception as e:
        return False, [str(e)]

async def validate_and_retry(ui_generator, prompt_data: dict, max_retries: int = 1) -> dict:
    # First attempt
    payload = await ui_generator.run(**prompt_data)
    is_valid, errors = validate_payload(payload)
    if is_valid:
        return payload
    
    # Retry with error feedback
    for i in range(max_retries):
        error_feedback = f"Your previous JSON output had validation errors: {'; '.join(errors)}. Please fix and return valid A2UI JSON matching the schema precisely."
        prompt_data['error_feedback'] = error_feedback
        payload = await ui_generator.run(**prompt_data)
        is_valid, errors = validate_payload(payload)
        if is_valid:
            return payload
    
    # Fallback to safe error UI
    return {
        'type': 'a2ui',
        'version': '1.0',
        'components': [
            {'type': 'card', 'title': 'Processing Error', 'children': [
                {'type': 'text', 'text': 'I encountered an error generating the UI. Please try rephrasing your request.', 'variant': 'body'},
                {'type': 'text', 'text': f'Validation errors: {"; ".join(errors)}', 'variant': 'caption'}
            ]}
        ]
    }
