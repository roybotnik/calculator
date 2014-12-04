# -*- coding: utf-8 -*-
import calc
import unittest
import tempfile

class CalcTestCase(unittest.TestCase):
  def setUp(self):
    self.app = calc.app.test_client()

  def test_get_index_should_be_successful(self):
    response = self.app.get('/')
    self.assertEquals(response.status_code, 200)

  def test_get_calculation_result_should_be_successful(self):
    response = self.app.get('/api/v1/calculation/result?expression=2%2B2')
    self.assertEquals(response.status_code, 200)

if __name__ == '__main__':
  unittest.main()
