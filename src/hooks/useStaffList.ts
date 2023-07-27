import { DicGroupKey } from '../enums'
const { getDicGroup } = storeToRefs(store.dictionary);
// staffCategory是一个响应式对象，其值为字典组，包含了员工类别的数据
export const staffCategory = getDicGroup.value(DicGroupKey.StaffCategory); 

export const getCategoryName = (stf_category: any) => {
  let category = staffCategory.find(item => item.dic_id === stf_category)
  return category ? category.dic_name : stf_category;
};

export const fetchStaffList = async (selectedCategory: any, searchValue: string) => {
  // 根据selectedCategory和searchValue发送请求并获取员工列表数据
  const data = {
    stf_category: selectedCategory,
    stf_name: searchValue,
    begin: 0,
    pageSize: 10
  };
  let staffList = await api.staff.getList(data);
  // 解构出list和total
  const { list, total } = staffList;
  // 返回员工列表数据和总数
  return { list, total };
};

const { list } = await fetchStaffList(null, '')
export const staffList = list