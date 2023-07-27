export const fetchUserList = async (selectedRole: any, searchValue: string) => {
  // 根据selectedCategory和searchValue发送请求并获取员工列表数据
  const data = {
    role_id: selectedRole,
    user_name: searchValue,
    begin: 0,
    pageSize: 10,
    currentPage: 1
  };
  let { list, total } = await api.user.getList(data);
  return { list, total };
};

export const roleList = await api.role.getAll();

export const getRoleName = (id: number) => {
  let roleName = roleList.find(item => item.role_id === id)
  return roleName ? roleName.role_name : id;
}
