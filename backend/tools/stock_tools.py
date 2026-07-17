import yfinance as yf

SYMBOL_MAP = {
    'RELIANCE': 'RELIANCE.NS',
    'TCS': 'TCS.NS',
    'INFY': 'INFY.NS',
    'HDFCBANK': 'HDFCBANK.NS',
    'ICICIBANK': 'ICICIBANK.NS',
    'WIPRO': 'WIPRO.NS',
    'ITC': 'ITC.NS',
    'SBIN': 'SBIN.NS',
    'BHARTIARTL': 'BHARTIARTL.NS',
    'HINDUNILVR': 'HINDUNILVR.NS',
    'LT': 'LT.NS',
    'BAJFINANCE': 'BAJFINANCE.NS',
    'MARUTI': 'MARUTI.NS',
    'SUNPHARMA': 'SUNPHARMA.NS',
    'TATAMOTORS': 'TATAMOTORS.NS',
    'TATASTEEL': 'TATASTEEL.NS',
    'ADANIENT': 'ADANIENT.NS',
    'AXISBANK': 'AXISBANK.NS',
    'KOTAKBANK': 'KOTAKBANK.NS',
    'ASIANPAINT': 'ASIANPAINT.NS',
}

def resolve_symbol(name: str) -> str:
    upper = name.upper().strip()
    if upper in SYMBOL_MAP:
        return SYMBOL_MAP[upper]
    if not upper.endswith('.NS') and not upper.endswith('.BO'):
        return f"{upper}.NS"
    return upper

def get_stock_info(symbol: str) -> dict:
    """Get comprehensive stock info."""
    try:
        ticker = yf.Ticker(resolve_symbol(symbol))
        info = ticker.info
        
        # Ensure we don't crash on missing keys
        return {
            'symbol': symbol.upper(),
            'name': info.get('longName', symbol),
            'price': info.get('currentPrice', info.get('regularMarketPrice', 0)),
            'change_percent': round(info.get('regularMarketChangePercent', 0) * 100, 2) if info.get('regularMarketChangePercent') else 0,
            'market_cap': info.get('marketCap', 0),
            'pe_ratio': round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else 0,
            'pb_ratio': round(info.get('priceToBook', 0), 2) if info.get('priceToBook') else 0,
            'dividend_yield': round(info.get('dividendYield', 0) * 100, 2) if info.get('dividendYield') else 0,
            'fifty_two_week_high': info.get('fiftyTwoWeekHigh', 0),
            'fifty_two_week_low': info.get('fiftyTwoWeekLow', 0),
            'sector': info.get('sector', 'N/A'),
            'industry': info.get('industry', 'N/A'),
        }
    except Exception as e:
        return {'symbol': symbol, 'error': str(e), 'name': symbol, 'price': 0}

def get_stock_comparison(symbols: list[str]) -> dict:
    """Compare multiple stocks side by side."""
    data = {}
    for s in symbols:
        data[s.upper()] = get_stock_info(s)
    return data

def calculate_allocation(amount: float, risk_profile: str, preferences: dict | None = None) -> dict:
    """Calculate portfolio allocation based on risk profile."""
    # Define allocation templates
    allocations = {
        'conservative': {
            'Large Cap Equity': 50, 'Mid/Small Cap': 15, 'Debt/Bonds': 25, 'Gold': 10,
            'suggested_stocks': ['HDFCBANK', 'TCS', 'HINDUNILVR', 'ITC']
        },
        'moderate': {
            'Large Cap Equity': 40, 'Mid/Small Cap': 25, 'Debt/Bonds': 25, 'Gold': 10,
            'suggested_stocks': ['RELIANCE', 'TCS', 'ICICIBANK', 'INFY']
        },
        'aggressive': {
            'Large Cap Equity': 25, 'Mid/Small Cap': 55, 'Debt/Bonds': 10, 'Gold': 10,
            'suggested_stocks': ['TATAMOTORS', 'BAJFINANCE', 'ADANIENT', 'ZOMATO']
        }
    }
    
    profile = allocations.get(risk_profile.lower(), allocations['moderate'])
    result = {
        'amount': amount,
        'risk_profile': risk_profile,
        'allocation': {},
        'suggested_stocks': []
    }
    
    for category, pct in profile.items():
        if category != 'suggested_stocks':
            result['allocation'][category] = {
                'percentage': pct,
                'amount': round(amount * pct / 100, 2)
            }
    
    # We will just return the names to save time on API calls for the demo, 
    # but could fetch live prices here if desired
    result['suggested_stocks_list'] = profile['suggested_stocks']
    
    return result
