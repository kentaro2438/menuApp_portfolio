import '../reset.css';
import { useState, useEffect } from "react";
import { getAllIng, getCat, addDish } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';


function AddDish() {
    const [ingData, setIngData] = useState<ingType[]>([]); //全ての材料
    const [catData, setCatData] = useState<catType[]>([]); //カテゴリー
    const [newDishName, setNewDishName] = useState<string>(""); //新しい料理名
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]); //選択された材料のIDリスト
    const [successMessage, setSuccessMessage] = useState<string>(""); //成功メッセージ
    const [error, setError] = useState<string>(""); //エラーメッセージ

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
    }, []);

    //全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list);
    };

    //カテゴリーを取得
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

    const handleNewDish = async (e: any) => {
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

    return (
        <div className="main">
            <h2>料理を追加</h2>
            <form onSubmit={handleNewDish}>
                <div>
                    <label htmlFor="dishName">料理名</label>
                    <input
                        id="dishName"
                        type="text"
                        value={newDishName}
                        onChange={(e) => setNewDishName(e.target.value)}
                        placeholder="料理名を入力"
                    />
                </div>
                <div className="card-container">
                    {catData.map((cat) => (
                        <div key={cat.cat_id} className="card">
                            <h3>{cat.cat_name}</h3>
                            <div className="grid-container">
                                {ingData
                                    .filter((ing) => ing.cat_id === cat.cat_id)
                                    .map((ing) => (
                                        <label key={ing.ing_id} style={{ display: "block" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIngIds.includes(ing.ing_id)}
                                                onChange={() => handleCheckboxChange(ing.ing_id)}
                                            />
                                            {ing.ing_name}
                                        </label>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit">追加</button>
            </form>
            <div className="message">
                {successMessage && <p>{successMessage}</p>}
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default AddDish;