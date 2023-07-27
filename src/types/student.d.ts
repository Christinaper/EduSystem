interface Student {
  readonly stu_id: number;
  stu_name: string;
  stu_avatar: string;
  stu_cls_id: number;
  stu_sex: number;
  stu_phone: string;
  stu_phone2: string;
  stu_born: string | Dayjs;
  stu_born: string;
  stu_qualification: number | string;
  stu_school: string;
  stu_major: string;
  stu_address: string;
  stu_remark: string;
  stu_bornInit: undefined | Dayjs;
}

interface StudentList {
  total: number;
  list: Student[];
}

interface StudentAssign {
  stu_id: number | null;
  stu_ids: number[];
  stu_cls_id: number | string;
}

interface AvatarUpdate {
  stu_id: number;
  stu_avatar_old: string | undefined;
  stu_avatar_new: string | undefined | any;
}