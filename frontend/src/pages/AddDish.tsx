import '../reset.css';
import { useState, useEffect } from "react";
import { getAllIng, getCat, addDish } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import IngCardCheckboxType from '../components/IngCardCheckboxType.tsx';

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
            <form onSubmit={handleNewDish}>
                <h3>料理名を入力</h3>
                <hr />
                <div className="input-area">
                    <Input
                        word={newDishName}
                        setWord={setNewDishName}
                        placeholder="料理名を入力"
                    />
                </div>
                <h3>材料を選択</h3>
                <hr />
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
                {filteredIngData.map((ing: ingType) => (
                    <IngCardCheckboxType
                        key={ing.ing_id}
                        ing={ing}
                        catData={catData}
                        selectedIngIds={selectedIngIds}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                ))}
                <button type="submit">追加</button>
            </form>
        </div>
    );
}

export default AddDish;