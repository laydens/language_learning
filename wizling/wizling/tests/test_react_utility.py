import os
from ..react_utility import get_asset_filenames
import unittest
from unittest.mock import patch, mock_open
import json



class TestReactUtility(unittest.TestCase):

    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps({
        "files": {
            "main.css": "/static/css/main.571afa6d.css",
            "main.js": "/static/js/main.2cb036c1.js"
        }
    }))
    def test_get_asset_filenames(self, mock_file):
        expected = {
            'main_js': '/static/js/main.2cb036c1.js',
            'main_css': '/static/css/main.571afa6d.css'
        }
        result = get_asset_filenames()
        self.assertEqual(result, expected)

if __name__ == '__main__':
    unittest.main()
