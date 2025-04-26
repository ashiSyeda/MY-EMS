import express from 'express';
import { 
  addSalary, 
  getSalaries, 
  getEmployeeSalaries 
} from '../controller/SalaryControllr.mjs';

const router = express.Router();

router.post('/', addSalary);
router.get('/', getSalaries);
router.get('/employee/:employeeId', getEmployeeSalaries);

export default router;