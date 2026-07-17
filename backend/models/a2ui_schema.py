from typing import Literal, Union, Annotated, Any
from pydantic import BaseModel, Field

class TokenUsage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0

class AgentStep(BaseModel):
    agent: str
    duration_ms: int
    token_usage: TokenUsage

class ChatMessageIn(BaseModel):
    session_id: str
    message: str

class ActionIn(BaseModel):
    session_id: str
    action: str
    data: dict[str, Any] = {}

# --- Component Base ---
class ComponentBase(BaseModel):
    id: str | None = None

# --- Component Types ---
class TextComponent(ComponentBase):
    type: Literal['text'] = 'text'
    text: str
    variant: Literal['heading', 'subheading', 'body', 'caption'] | None = None

class ButtonComponent(ComponentBase):
    type: Literal['button'] = 'button'
    label: str
    action: str
    variant: Literal['primary', 'secondary', 'danger'] | None = None
    disabled: bool = False

class TextFieldComponent(ComponentBase):
    type: Literal['text-field'] = 'text-field'
    name: str
    label: str
    placeholder: str | None = None
    required: bool = False
    inputType: Literal['text', 'email', 'password', 'number', 'tel'] | None = None
    defaultValue: str | None = None

class SelectOption(BaseModel):
    value: str
    label: str

class SelectComponent(ComponentBase):
    type: Literal['select'] = 'select'
    name: str
    label: str
    options: list[SelectOption]
    defaultValue: str | None = None

class CheckboxComponent(ComponentBase):
    type: Literal['checkbox'] = 'checkbox'
    name: str
    label: str
    defaultChecked: bool = False

class GraphComponent(ComponentBase):
    type: Literal['graph'] = 'graph'
    graphType: Literal['bar', 'line', 'pie']
    title: str | None = None
    data: list[dict[str, Union[str, float, int]]]
    dataKeys: list[str] | None = None
    xAxisKey: str | None = None

class DatePickerComponent(ComponentBase):
    type: Literal['date-picker'] = 'date-picker'
    name: str
    label: str
    defaultValue: str | None = None

class TableColumn(BaseModel):
    header: str
    key: str
    align: Literal['left', 'center', 'right'] | None = None

class TableComponent(ComponentBase):
    type: Literal['table'] = 'table'
    columns: list[TableColumn]
    rows: list[dict[str, Union[str, float, int]]]

class BadgeComponent(ComponentBase):
    type: Literal['badge'] = 'badge'
    text: str
    variant: Literal['success', 'warning', 'danger', 'info', 'neutral'] = 'neutral'

class ProgressComponent(ComponentBase):
    type: Literal['progress'] = 'progress'
    label: str
    value: float
    color: str | None = None

class DividerComponent(ComponentBase):
    type: Literal['divider'] = 'divider'

class CardComponent(ComponentBase):
    type: Literal['card'] = 'card'
    title: str | None = None
    children: list['A2UIComponent']

class ContainerComponent(ComponentBase):
    type: Literal['container'] = 'container'
    direction: Literal['row', 'column'] | None = None
    gap: int | None = None
    children: list['A2UIComponent']

class FormComponent(ComponentBase):
    type: Literal['form'] = 'form'
    action: str
    children: list['A2UIComponent']

A2UIComponent = Annotated[
    Union[
        TextComponent,
        ButtonComponent,
        TextFieldComponent,
        SelectComponent,
        CheckboxComponent,
        GraphComponent,
        DatePickerComponent,
        TableComponent,
        BadgeComponent,
        ProgressComponent,
        DividerComponent,
        CardComponent,
        ContainerComponent,
        FormComponent,
    ],
    Field(discriminator='type')
]

# Resolve recursive references
CardComponent.model_rebuild()
ContainerComponent.model_rebuild()
FormComponent.model_rebuild()

class A2UIPayload(BaseModel):
    type: Literal['a2ui'] = 'a2ui'
    version: str = '1.0'
    components: list[A2UIComponent]
