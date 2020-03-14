export const TYPE_OPTIONS = [
  {
    value: '10',
    label: '首页banner展位（固定）'
  },
  {
    value: '11',
    label: '首页编辑推荐展位（固定）'
  },
  {
    value: '1',
    label: '首页普通推荐展位（固定）'
  },
  {
    value: '0',
    label: '自定义展位（非固定）'
  }
];

export const TYPE_MAP = {};
TYPE_OPTIONS.forEach((item) => {
  TYPE_MAP[`${item.value}`] = item.label;
});

export const STATE_OPTIONS = [
  {
    value: '0',
    label: '未激活'
  },
  {
    value: '1',
    label: '已激活'
  }
];

export const STATE_MAP = {};
STATE_OPTIONS.forEach((item) => {
  STATE_MAP[`${item.value}`] = item.label;
});
