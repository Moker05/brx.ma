"""
Flask microservice pour les données de la Bourse de Casablanca
Utilise BVCscrap pour récupérer les données
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from bvc_wrapper import BVCWrapper

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=cors_origins)

# Initialize BVC wrapper
bvc = BVCWrapper()

# Constants
CACHE_TTL = int(os.getenv('CACHE_TTL', 900))  # 15 minutes

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'bvc-scraper',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    """Get list of all stocks"""
    try:
        stocks = bvc.get_all_stocks()
        return jsonify({
            'success': True,
            'data': stocks,
            'count': len(stocks),
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/stocks/<symbol>', methods=['GET'])
def get_stock_detail(symbol):
    """Get details for a specific stock"""
    try:
        symbol = symbol.upper()
        stock_data = bvc.get_stock_detail(symbol)

        if not stock_data:
            return jsonify({
                'success': False,
                'error': f'Stock {symbol} not found',
                'timestamp': datetime.utcnow().isoformat()
            }), 404

        return jsonify({
            'success': True,
            'data': stock_data,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/stocks/<symbol>/history', methods=['GET'])
def get_stock_history(symbol):
    """Get historical data for a stock"""
    try:
        symbol = symbol.upper()

        # Get date parameters
        start_date = request.args.get('start')
        end_date = request.args.get('end')

        # Default to last 30 days if not specified
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')

        history = bvc.get_historical_data(symbol, start_date, end_date)

        return jsonify({
            'success': True,
            'symbol': symbol,
            'data': history,
            'count': len(history),
            'period': {
                'start': start_date,
                'end': end_date
            },
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/stocks/<symbol>/intraday', methods=['GET'])
def get_stock_intraday(symbol):
    """Get intraday data for a stock"""
    try:
        symbol = symbol.upper()
        intraday = bvc.get_intraday_data(symbol)

        return jsonify({
            'success': True,
            'symbol': symbol,
            'data': intraday,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/sectors', methods=['GET'])
def get_sectors():
    """Get all sectors and their performance"""
    try:
        sectors = bvc.get_sectors()

        return jsonify({
            'success': True,
            'data': sectors,
            'count': len(sectors),
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/indices', methods=['GET'])
def get_indices():
    """Get market indices (MASI, MADEX, etc.)"""
    try:
        indices = bvc.get_indices()

        return jsonify({
            'success': True,
            'data': indices,
            'count': len(indices),
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'timestamp': datetime.utcnow().isoformat()
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'timestamp': datetime.utcnow().isoformat()
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'

    print(f"""
    ==========================================
      BVC Scraper Microservice Started
    ==========================================

    Server: http://localhost:{port}
    Health: http://localhost:{port}/health
    API: http://localhost:{port}/api/stocks

    Environment: {os.getenv('FLASK_ENV', 'production')}
    Cache TTL: {CACHE_TTL}s
    """)

    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
