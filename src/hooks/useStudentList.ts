import { DicGroupKey } from '../enums'
import { classList } from './useClassList';

const { getDicGroup } = storeToRefs(store.dictionary);
export const Qualification = getDicGroup.value(DicGroupKey.Qualification);

export const getClassName = (id: number) => {
  let className = classList.find(item => item.cls_id === id)
  return className ? className.cls_name : id;
}

export const getQualificationName = (id: number) => {
  let qualificationName = Qualification.find(item => item.dic_id === id)
  return qualificationName ? qualificationName.dic_name : id;
}

export const fetchStudentList = async () => {
  // 根据selectedCategory和searchValue发送请求并获取员工列表数据
  const data = {
    stu_cls_id: 0,
    stu_name: '',
    stu_qualification: 0,
    begin: 0,
    currentPage: 1,
    pageSize: 10
  };
  let studentList = await api.student.getList(data);
  console.log('2323'+JSON.stringify(data), studentList);
  
  // 返回员工列表数据
  return studentList.list;
};
