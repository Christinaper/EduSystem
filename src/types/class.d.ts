interface Class {
  readonly cls_id: number;
  cls_name: string;
  cls_dic_id_major: number | string;
  cls_clsr_id: number | null;
  cls_stf_id_teacher: number | string;
  cls_stf_id_teacher_name: string;
  cls_stf_id_admin: number | string;
  cls_stf_id_admin_name: string;
  cls_stf_id_job: number | string;
  cls_stf_id_job_name: string;
  cls_begin: null;
  cls_end: null;
  cls_remark: string;
}

interface ClassList {
  total: number;
  list: Class[];
}

interface ClassBegin {
  cls_clsr_id: number | string; // 加string是想在输入框显示“请选择”，而不是数字初始值
  cls_id: number;
}