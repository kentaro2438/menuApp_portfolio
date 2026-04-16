import '../reset.css';
import { useState, useEffect } from "react";
import { getAllIng, getCat, addDish } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';

function AddDish() {
    const [ingData, setIngData] = useState<ingType[]>([]); // 全ての材料
    const [catData, setCatData] = useState<catType[]>([]); // カテゴリー
    const [newDishName, setNewDishName] = useState<string>(""); // 新しい料理名
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]); // 選択された材料のIDリスト
    const [successMessage, setSuccessMessage] = useState<string>(""); // 成功メッセージ
    const [error, setError] = useState<string>(""); // エラーメッセージ
    const [searchWord, setSearchWord] = useState<string>(""); // 材料検索
    const [showCatId, setShowCatId] = useState<string>(""); // カテゴリー絞り込み

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
    }, []);

    // 全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list);
    };

    // カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list);
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

        const trimmedDishName = newDishName.trim();

        if (!trimmedDishName) {
            setError("料理名を入力してください");
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        if (selectedIngIds.length === 0) {
            setError("材料を1つ以上選択してください");
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        try {
            await addDish(trimmedDishName, selectedIngIds);
            setSuccessMessage('料理が追加されました');
            setNewDishName('');
            setSelectedIngIds([]);
        } catch (error: any) {
            setError(`エラー: ${error.message}`);
            return;
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 2000);
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
        <div className="main">
            <h2>料理を追加</h2>

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

            <form onSubmit={handleNewDish}>
                <div>
                    <label htmlFor="dishName">料理名</label>
                    <Input
                        word={newDishName}
                        setWord={setNewDishName}
                        placeholder="料理名を入力"
                    />
                </div>

                <div>
                    {filteredIngData.map((ing: ingType) => {
                        const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                        return (
                            <div key={ing.ing_id} className="card">
                                <div className="text-area">
                                    <p className='cat-name'>{catName}</p>
                                    <p className='ing-name'>{ing.ing_name}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedIngIds.includes(ing.ing_id)}
                                    onChange={() => handleCheckboxChange(ing.ing_id)}
                                />
                            </div>
                        );
                    })}
                </div>

                <button type="submit">追加</button>
            </form>

            <div className="message">
                {successMessage && <p className='success-message'>{successMessage}</p>}
                {error && <p className='error-message'>{error}</p>}
            </div>
        </div>
    );
}

export default AddDish;