import '../reset.css';
import '../css/refrigerator_shoppinglist.css';
import { useEffect, useState } from "react";
import { getAllIng, getCat, getShoppingList, addIngToShoppingList, deleteIngFromShoppingList } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { Plus, ShoppingCart } from 'lucide-react';
import ShoppingCard from '../components/ShoppingCard.tsx';
import { Check } from 'lucide-react';


function ShoppingList() {

    const [ingData, setIngData] = useState<ingType[]>([]); 
    const [catData, setCatData] = useState<catType[]>([]); 
    const [showCatId, setShowCatId] = useState(""); 
    const [searchWord, setSearchWord] = useState(""); //検索文字
    const [shoppingList, setShoppingList] = useState<ingType[]>([]); //買い物リストにある材料   
    const [firstLoading, setFirstLoading] = useState<boolean>(false); 
    const shoppingListIngIdSet = new Set(shoppingList.map(ing => ing.ing_id)); //買い物リストにある材料IDのセット（重複なし）
    const { showNotification } = useNotification();

    //ローディング表示
    useEffect(() => {
        const firstFetch = async () => {
            setFirstLoading(true);
            await fetchGetAllIng();
            await fetchGetCat();
            await fetchGetShoppingList();
            setFirstLoading(false);
        };
        firstFetch();
    }, []);

    if (firstLoading) {
        return (
            <div className="main loading-area">
                <div className="spinner"></div>
                <p>読み込み中...</p>
            </div>
        );
    };

    //全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list_json);
    };

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };

    //検索とカテゴリー絞り込み
    const filteredIngData = ingData.filter((ing: ingType) => {
        const matchCategory = showCatId === "" || ing.cat_id === Number(showCatId);
        const matchSearch = ing.ing_name.includes(searchWord.trim());
        const notInShoppingList = !shoppingListIngIdSet.has(ing.ing_id); //買い物リストにない材料のみ表示
        return matchCategory && matchSearch && notInShoppingList;
    });

    // 買い物リストの材料を取得
    const fetchGetShoppingList = async () => {
        const data = await getShoppingList();
        setShoppingList(data.shopping_list_json);
    };

    //買い物リストに材料を追加
    const handleAddIngToShoppingList = async (ing_id: number) => {
        try {
            await addIngToShoppingList(ing_id);
            showNotification("success", "材料が買い物リストに追加されました");
            fetchGetShoppingList();
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    }

    //買い物リストから材料を削除
    const handleDeleteIngFromShoppingList = async (ing_id: number) => {
        try {
            await deleteIngFromShoppingList(ing_id);
            showNotification("success", "材料が買い物リストから削除されました");
            fetchGetShoppingList();
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    }

    return (
        <div className="main shopping-list-page">
            <h2><ShoppingCart className='h2-icon' /> 買い物リスト</h2>
            <hr />
            <br />
            <p>買い物リストを管理できます．以下のリストで材料を追加・削除できます．</p>
            <br />
            <div className='description'>
                <div>
                    <div className='icon-area add'>
                        <Plus className='icon-size' />
                    </div>
                    買い物リストに追加
                </div>
                <div>
                    <div className='icon-area check'>
                        <Check className='icon-size' />
                    </div>
                    購入済みにする
                </div>
            </div>
            <br />
            <div className="input-area">
                <Input
                    word={searchWord}
                    setWord={setSearchWord}
                    placeholder="材料名を検索"
                />
                <Select
                    showCatId={showCatId}
                    setShowCatId={setShowCatId}
                    catData={catData}
                />
            </div>
            <div className='two-columns-container'>
                <div className='not_purchased'>
                    <p className='card-header'>買い物リストにない材料<span className='length'>{filteredIngData.length}</span></p>
                    <div className="ref-columns-container">
                        {filteredIngData
                            .sort((a, b) => a.cat_id - b.cat_id)
                            .map((ing: ingType) => {
                                const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                                const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                                return (
                                    <ShoppingCard
                                        key={ing.ing_id}
                                        ing={ing}
                                        catId={catId}
                                        catName={catName}
                                        type="add"
                                        onClick={handleAddIngToShoppingList}
                                    />
                                )
                            })}
                    </div>
                </div>
                <div className='purchased'>
                    <p className='card-header'>買い物リスト<span className='length'>{shoppingList.length}</span></p>
                    <div className="ref-columns-container">
                        {shoppingList
                            .map((ing: ingType) => {
                                const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                                const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                                return (
                                    <div key={ing.ing_id} className="card inner-wrap">
                                        <div>
                                            <p className='name'>{ing.ing_name} </p>
                                            <div className='inner-wrap'>
                                                <p className={`cat-name cat-${catId}`}>{catName}</p>
                                            </div>
                                        </div>
                                        <div className="btn-container">
                                            <button className="btn-sub check" onClick={() => handleDeleteIngFromShoppingList(ing.ing_id)}>
                                                <Check className='lucide-icon' />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingList;