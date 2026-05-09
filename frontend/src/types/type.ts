export type catType = {
    cat_id: number;
    cat_name: string;
};

export type ingType = {
    ing_id: number;
    ing_name: string;
    cat_id: number;
    added_at: string;
};

export type dishType = {
    dish_id: number;
    dish_name: string;
    memo: string;
};

export type refIngType = {
    ing_id: number;
    ing_name: string;
    cat_id: number;
    added_at: string;
};

export type ResultItemType = [
    string,
    number,
    number,
    string[],
    number[],
    number
];
// [料理名, 一致数, 不足数, 不足材料名リスト, 不足材料IDリスト, 一致率]

