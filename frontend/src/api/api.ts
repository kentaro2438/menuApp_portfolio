const BASE_URL = 'http://127.0.0.1:5000/api';

const apiFetch = async (URL: string, options: RequestInit = {}) => {
    const result = await fetch(`${BASE_URL}${URL}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });
    const data = await result.json();
    if (!result.ok) {
        throw new Error(data.message);
    }
    return data;
};


// サインアップ
export const signUp = (username: string, password: string) => apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({
        username: username,
        password: password,
    }),
});

// ログイン
export const login = (username: string, password: string) => apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({
        username: username,
        password: password,
    }),
});

// 全ての材料を取得
export const getAllIng = () => apiFetch('/getAllIng');

//特定の材料を取得
export const getIng = (ing_id: number) => apiFetch(`/ing/${ing_id}`);

// カテゴリーを取得
export const getCat = () => apiFetch('/getCat');

// 全ての料理を取得
export const getAllDish = () => apiFetch('/getAllDish');

//特定の料理を取得
export const getDish = (dish_id: number) => apiFetch(`/dish/${dish_id}`);

// 材料を追加
export const addIng = (new_ing_name: string, new_ing_cat_id: number) => apiFetch('/ing', {
    method: 'POST',
    // 送信するデータをJSON形式で指定
    body: JSON.stringify({
        new_ing_name: new_ing_name,
        new_ing_cat_id: new_ing_cat_id,
    }),
});

// 材料を編集
export const editIng = (ing_id: number, ing_name: string, cat_id: number) => apiFetch(`/ing/${ing_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        ing_id: ing_id,
        ing_name: ing_name,
        cat_id: cat_id,
    })
});

// 料理を追加
export const addDish = (new_dish_name: string, ing_id_needed_list: number[], newDishMemo: string) => apiFetch('/dish', {
    method: 'POST',
    body: JSON.stringify({
        new_dish_name: new_dish_name,
        ing_id_needed_list: ing_id_needed_list,
        new_dish_memo: newDishMemo,
    }),
});

// 料理を編集
export const editDish = (dish_id: number, dish_name: string, ing_id_needed_list: number[], dish_memo: string) => apiFetch(`/dish/${dish_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        dish_id: dish_id,
        dish_name: dish_name,
        ing_id_needed_list: ing_id_needed_list,
        dish_memo: dish_memo,
    }),
});

//料理を削除
export const deleteDish = (dish_id: number) => apiFetch(`/dish/${dish_id}`, {
    method: 'DELETE',
});

// 料理を検索
export const searchDish = (searched_ing_id_list: number[]) => apiFetch('/searchDish', {
    method: 'POST',
    body: JSON.stringify({
        searched_ing_id_list: searched_ing_id_list,
    }),
});

// 冷蔵庫の材料を取得
export const getRefIng = () => apiFetch('/ref');

// 冷蔵庫に材料を追加
export const addIngToRef = (ing_id: number) => apiFetch('/ref', {
    method: 'POST',
    body: JSON.stringify({
        ing_id: ing_id,
    }),
});

// 冷蔵庫から材料を削除
export const deleteIngFromRef = (ing_id: number) => apiFetch(`/ref/${ing_id}`, {
    method: 'DELETE',
});

// 買い物リストの材料を取得
export const getShoppingList = () => apiFetch('/shoppingList');

// 買い物リストに材料を追加
export const addIngToShoppingList = (ing_id: number) => apiFetch('/shoppingList', {
    method: 'POST',
    body: JSON.stringify({
        ing_id: ing_id,
    }),
});

// 買い物リストから材料を削除
export const deleteIngFromShoppingList = (ing_id: number) => apiFetch(`/shoppingList/${ing_id}`, {
    method: 'DELETE',
});

// 不足材料を買い物リストに追加
export const addLackIngToShoppingList = (lack_ing_id_list: number[]) => apiFetch('/addLackIngToShoppingList', {
    method: 'POST',
    body: JSON.stringify({
        lack_ing_id_list: lack_ing_id_list,
    }),
});
