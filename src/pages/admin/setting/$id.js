/**
 * title: 编辑系统配置
 * authority:
 *  - setting
 */
import { editor } from '@/component/pager';

@editor
class Instance {
  static model = 'setting';

  config = {
    name: '系统配置',
    query_inject: {},
    form: window.setting || [],
  };
}

export default Instance;
