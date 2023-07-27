/* 类型，对结构描述 */
interface Login {
  user_name: string;
  user_pwd: string;
}

interface User {
  user_name: string;
  user_pwd: string;
  role_id: number; 
}

interface UserList {
  list: User[];
  total: number;
}

interface PwdChange {
  newPwd: string;
  newPwdAgain: string;
  oldPwd: string;
}