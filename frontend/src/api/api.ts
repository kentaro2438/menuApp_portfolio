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
        throw new Error(`エラー: ${result.status}`);
    }
    return data;
};

// 全ての材料を取得
export const getAllIng = () => apiFetch('/getAllIng');

//特定の材料を取得
export const getIng = (ing_id: number) => apiFetch(`/getIng/${ing_id}`);

// カテゴリーを取得
export const getCat = () => apiFetch('/getCat');

// 全ての料理を取得
export const getAllDish = () => apiFetch('/getAllDish');

//特定の料理を取得
export const getDish = (dish_id: number) => apiFetch(`/getDish/${dish_id}`)

// 材料を追加
export const addIng = (new_ing_name: string, new_ing_cat_id: number) => apiFetch('/addIng', {
    method: 'POST',
    // 送信するデータをJSON形式で指定
    body: JSON.stringify({
        new_ing_name: new_ing_name,
        new_ing_cat_id: new_ing_cat_id,
    }),
});

// 材料を編集
export const editIng = (ing_id: number, ing_name: string, cat_id: number) => apiFetch(`/editIng/${ing_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        ing_id: ing_id,
        ing_name: ing_name,
        cat_id: cat_id,
    })
});

// 料理を追加
export const addDish = (new_dish_name: string, ing_id_needed_list: number[]) => apiFetch('/addDish', {
    method: 'POST',
    body: JSON.stringify({
        new_dish_name: new_dish_name,
        ing_id_needed_list: ing_id_needed_list,
    }),
});

// 料理を編集
export const editDish = (dish_id: number, dish_name: string, ing_id_needed_list: number[]) => apiFetch(`/editDish/${dish_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        dish_id: dish_id,
        dish_name: dish_name,
        ing_id_needed_list: ing_id_needed_list,
    }),
});


// ここから未編集------------------------------------------------------------------------------------------------------------------------------------







// 料理を削除
export const deleteDish = (dish_id: number) => apiFetch(`/deleteDish/${dish_id}`, {
    method: 'DELETE',
});




// 料理を検索
export const searchDish = (searched_ing_id_list: number[]) => apiFetch('/searchDish', {
    method: 'POST',
    body: JSON.stringify({
        searched_ing_id_list: searched_ing_id_list,
    }),
});
