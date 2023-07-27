// 泛型接口
interface Edit<T> {
  isEdit: boolean;
  formRef: FormInstance | null;
  model: T; // 类型为T, 可以是任何类型
  rules?: import('vue').Raw<Rule>; // 可选类型，
}

/**
 * Vue 框架中的 Raw 类型的 Rule 类型是一个用于定义表单验证规则的类型，
 * 它是一个泛型类型，可以接受任何类型的参数。
 */