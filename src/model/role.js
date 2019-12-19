import CurdModel from './curd';
import curdServiceBuilder from '@/service/curd';

class Model extends CurdModel {
  constructor() {
    super(curdServiceBuilder('role'));
  }
}

export default new Model();
