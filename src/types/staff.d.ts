// 这是一个TypeScript的声明文件，用来提供一个JavaScript API的类型信息。
// 这样可以让TypeScript的代码使用JavaScript的库，而不需要重写库的代码。
// the d.ts file contains only the type annotations.

/**
 * 本文件定义了一个Staff接口，包含了一些属性
 * 这个接口可以被其他TypeScript文件引用，以便使用Staff类型的对象
 */

interface Staff {
  readonly stf_id: number;
  stf_name: string;
  stf_category: number | string; // 加string是想在输入框显示“请选择”，而不是数字初始值
  stf_remark: string;
  stf_invalid: number;
}

interface StaffList {
  total: number;
  list: Staff[];
}

interface StaffSearch { // 要使用，待修改
  stf_name: string;
  stf_category: DicGroupKey | string; // 加string是想在输入框显示“请选择”，而不是数字初始值
  begin: number;
  pageSize: number;
  currentPage: number;
}