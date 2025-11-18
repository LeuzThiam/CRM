from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Gestionnaire d'erreurs personnalisé pour l'API.
    Retourne des réponses d'erreur standardisées.
    """
    # Appeler le gestionnaire d'erreurs par défaut de DRF
    response = exception_handler(exc, context)

    # Si une réponse a été générée, la personnaliser
    if response is not None:
        custom_response_data = {
            'error': True,
            'status_code': response.status_code,
            'message': get_error_message(response.data),
            'details': response.data if isinstance(response.data, dict) else {'detail': str(response.data)},
        }
        response.data = custom_response_data
    else:
        # Pour les erreurs non gérées par DRF (500, etc.)
        logger.error(f"Erreur non gérée: {exc}", exc_info=True)
        custom_response_data = {
            'error': True,
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'message': 'Une erreur interne du serveur est survenue.',
            'details': {'detail': str(exc) if str(exc) else 'Erreur inconnue'},
        }
        response = Response(custom_response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response


def get_error_message(data):
    """
    Extrait un message d'erreur lisible depuis les données d'erreur de DRF.
    """
    if isinstance(data, dict):
        # Si c'est un dictionnaire, chercher les clés communes
        if 'detail' in data:
            return str(data['detail'])
        elif 'message' in data:
            return str(data['message'])
        elif 'non_field_errors' in data:
            return ', '.join(data['non_field_errors'])
        else:
            # Prendre le premier message d'erreur trouvé
            for key, value in data.items():
                if isinstance(value, list) and len(value) > 0:
                    return f"{key}: {value[0]}"
                elif isinstance(value, str):
                    return f"{key}: {value}"
    elif isinstance(data, list) and len(data) > 0:
        return str(data[0])
    elif isinstance(data, str):
        return data
    
    return 'Une erreur est survenue.'

