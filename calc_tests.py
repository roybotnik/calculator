# -*- coding: utf-8 -*-
import calc
import unittest
import tempfile
import json

class CalcTestCase(unittest.TestCase):
  def setUp(self):
    self.app = calc.app.test_client()

  def test_get_index_should_be_successful(self):
    response = self.app.get('/')
    self.assertEquals(response.status_code, 200)

  def test_get_calculation_result_should_be_successful(self):
    response = self.app.get('/api/v1/calculation/result?expression=2%2B2')
    self.assertEquals(response.status_code, 200)

  def test_get_calculation_result_should_return_json_result(self):
    response = self.app.get('/api/v1/calculation/result?expression=2%2B2')
    response_json = json.loads(response.data)
    self.assertEquals(response_json['result'], 4.0)

    response = self.app.get('/api/v1/calculation/result?expression=3120319823*3123')
    response_json = json.loads(response.data)
    self.assertEquals(response_json['result'], 9744758807229.0)

  def test_get_calculation_result_should_404_if_no_expression_supplied(self):
    response = self.app.get('/api/v1/calculation/result')
    self.assertEquals(response.status_code, 404)

  def test_get_calculation_should_500_if_expression_is_invalid(self):
    response = self.app.get('/api/v1/calculation/result?expression=haiguise')
    self.assertEquals(response.status_code, 500)

if __name__ == '__main__':
  unittest.main()
