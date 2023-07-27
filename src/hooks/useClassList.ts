import { DicGroupKey } from '../enums'
import { staffList } from './useStaffList';

const { getDicGroup } = storeToRefs(store.dictionary);

export const roomList = await api.classroom.getAll();

export const ClassMajor = getDicGroup.value(DicGroupKey.ClassMajor); 

export const getMajorName = (cls_dic_id_major: number) => {
  let major = ClassMajor.find(item => item.dic_id === cls_dic_id_major)
  return major ? major.dic_name : cls_dic_id_major;
}

export const getTeacherName = (id: number) => {
  let teacher = staffList.find(item => item.stf_id === id)
  return teacher ? teacher.stf_name : id;
}

export const getClsrName = (id: number) => {
  let room = roomList.find(item => item.clsr_id === id)
  return room ? room.clsr_name : id;
}

export const fetchClassList = async (selectedMajor: any) => {
  // 根据selectedCategory和searchValue发送请求并获取员工列表数据
  const data = {
    cls_name: "",
    cls_dic_id_major: selectedMajor,
    cls_status: 0,
    begin: 0,
    pageSize: 5
  };
  let classList = await api.classs.getList(data);
  // 解构出list和total
  const { list, total } = classList;
  // 返回员工列表数据和总数
  return { list, total };
};

const { list } = await fetchClassList(null);
export const classList = list