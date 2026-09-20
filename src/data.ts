/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OperationLog } from './types';

// High-fidelity operation logs corresponding to Image 3 (主体维护 / 操作日志)
export const INITIAL_OPERATION_LOGS: OperationLog[] = [
  {
    id: 1,
    operationType: '新建产品',
    operator: '张三',
    operatorPinyin: 'Zhangsan',
    department: '商务部',
    content: '新建产品，产品名称：数解舆情4.0',
    ip: '192.108.1',
    result: '成功',
    createdAt: '2025-07-08 23:00:00'
  },
  {
    id: 2,
    operationType: '新建产品',
    operator: '李四',
    operatorPinyin: 'Lisi',
    department: '技术部',
    content: '新建产品，产品名称：智能报告生成引擎V2.1',
    ip: '192.108.2.14',
    result: '成功',
    createdAt: '2025-07-08 22:45:10'
  },
  {
    id: 3,
    operationType: '修改产品',
    operator: '王五',
    operatorPinyin: 'Wangwu',
    department: '产品部',
    content: '更新产品详情信息，调整内部工时，产品: 媒体舆情网',
    ip: '192.108.1.102',
    result: '成功',
    createdAt: '2025-07-08 21:30:00'
  },
  {
    id: 4,
    operationType: '删除产品',
    operator: '李四',
    operatorPinyin: 'Lisi',
    department: '技术部',
    content: '删除临时测试产品：舆论热度沙箱',
    ip: '192.108.2.14',
    result: '成功',
    createdAt: '2025-07-08 19:15:00'
  },
  {
    id: 5,
    operationType: '创建报价单',
    operator: '白虎',
    operatorPinyin: 'Baihu',
    department: '销售科',
    content: '为邯郸市互联网信息办公室提交最终报价，总额 ¥110,256,281',
    ip: '192.168.10.85',
    result: '成功',
    createdAt: '2025-07-08 18:22:40'
  }
];

// Add generic logs to make table rich
for (let i = 6; i <= 32; i++) {
  INITIAL_OPERATION_LOGS.push({
    id: i,
    operationType: i % 4 === 0 ? '修改合同' : (i % 4 === 1 ? '新建产品' : (i % 4 === 2 ? '审核合同' : '登录系统')),
    operator: i % 3 === 0 ? '张三' : (i % 3 === 1 ? '李四' : '王五'),
    operatorPinyin: i % 3 === 0 ? 'Zhangsan' : (i % 3 === 1 ? 'Lisi' : 'Wangwu'),
    department: i % 3 === 0 ? '商务部' : (i % 3 === 1 ? '技术部' : '产品部'),
    content: i % 4 === 0 
      ? `修改合同：四川省公安厅销售合同，调整付款周期（第${i}次调整）`
      : (i % 4 === 1 ? `新建产品，产品名称：数解舆情${i}.0` : `审核合同：西安高新区数据中心二期服务，状态为：通过`),
    ip: `192.108.${Math.floor(i / 10)}.${10 + (i % 9)}`,
    result: '成功',
    createdAt: `2025-07-08 ${23 - Math.floor(i / 2)}:${(10 + i * 2) % 60}:00`
  });
}
