interface Func {
  readonly func_id: number;
  func_name: string;
  func_key: string;
  func_fid: number;
}

interface FuncTreeNode extends Func {
  children?: FuncTreeNode[]
}

type FuncTree = FuncTreeNode[];