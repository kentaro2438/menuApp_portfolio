import '../reset.css';
import { useState, useEffect } from "react";
import { getAllIng, getCat, addDish } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import IngCardCheckboxType from '../components/IngCardCheckboxType.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

function AddDish() {
    const { showNotification } = useNotification();
    const [ingData, setIngData] = useState<ingType[]>([]); 
    const [catData, setCatData] = useState<catType[]>([]); 
    const [newDishName, setNewDishName] = useState<string>(""); 
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]); // 検索用に選択された材料のIDリスト
    const [searchWord, setSearchWord] = useState<string>(""); // 材料検索
    const [showCatId, setShowCatId] = useState<string>(""); // カテゴリー絞り込み
    const [newDishMemo, setNewDishMemo] = useState<string>(""); 
    const [loading, setLoading] = useState<boolean>(false); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
    }, []);

    // 全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list_json);
    };

    // カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };

    const handleCheckboxChange = (ingId: number) => {
        setSelectedIngIds((prev) => {
            if (prev.includes(ingId)) {
                return prev.filter((id) => id !== ingId);
            }
            return [...prev, ingId];
        });
    };

    const handleNewDish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const trimmedDishName = newDishName.trim();

        if (!trimmedDishName) {
            showNotification("error", "料理名を入力してください");
            setLoading(false);
            return;
        }

        if (selectedIngIds.length === 0) {
            showNotification("error", "材料を1つ以上選択してください");
            setLoading(false);
            return;
        }

        try {
            await addDish(trimmedDishName, selectedIngIds, newDishMemo);
            showNotification("success", "料理が追加されました");
            setNewDishName('');
            setSelectedIngIds([]);
            setNewDishMemo('');
            navigate("/list_dish");
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        } finally {
            setLoading(false);
        }
    };

    const filteredIngData = ingData.filter((ing: ingType) => {
        const matchCategory =
            showCatId === "" || ing.cat_id === Number(showCatId);
        const matchSearch =
            ing.ing_name.includes(searchWord.trim());
        return matchCategory && matchSearch;
    });

    return (
        <div className="main add-dish-page">
            <h2><Plus className='h2-icon'/> 料理を追加</h2>
            <hr />
            <br />
            <form onSubmit={handleNewDish}>
                <h3>料理名を入力</h3>
                <div className="input-area">
                    <Input
                        word={newDishName}
                        setWord={setNewDishName}
                        placeholder="料理名を入力"
                    />
                </div>
                <h3>材料を選択</h3>
                <div className="input-area">
                    <Input
                        word={searchWord}
                        setWord={setSearchWord}
                        placeholder="材料を検索"
                    />
                    <Select
                        showCatId={showCatId}
                        setShowCatId={setShowCatId}
                        catData={catData}
                    />
                </div>
                <div>
                    <p className='card-header'>材料一覧<span className='length'>{filteredIngData.length}</span></p>
                    <div className='card-columns-container'>
                    
                        {filteredIngData
                            .sort((a, b) => a.cat_id - b.cat_id)
                            .map((ing: ingType) => (
                                <IngCardCheckboxType
                                    key={ing.ing_id}
                                    ing={ing}
                                    catData={catData}
                                    selectedIngIds={selectedIngIds}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            ))}
                    </div>
                </div>
                <br />
                <h3>メモ</h3>
                    <textarea
                        value={newDishMemo}
                        onChange={(e) => setNewDishMemo(e.target.value)}
                        placeholder="メモを入力(任意)"
                    />
                <button type="submit" disabled={loading}>
                    {loading ? "追加中..." : <><Plus className='icon-in-main-btn' /> 追加</>}
                </button>
            </form>
        </div>
    );
}

export default AddDish;