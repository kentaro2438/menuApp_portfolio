import '../reset.css';
import { useState, useEffect } from "react";
import { getAllIng, getCat, addDish } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import IngCardCheckboxType from '../components/IngCardCheckboxType.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from 'react-router-dom';

function AddDish() {
    const { showNotification } = useNotification();
    const [ingData, setIngData] = useState<ingType[]>([]); // 全ての材料
    const [catData, setCatData] = useState<catType[]>([]); // カテゴリー
    const [newDishName, setNewDishName] = useState<string>(""); // 新しい料理名
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]); // 選択された材料のIDリスト
    const [searchWord, setSearchWord] = useState<string>(""); // 材料検索
    const [showCatId, setShowCatId] = useState<string>(""); // カテゴリー絞り込み
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

        const trimmedDishName = newDishName.trim();

        if (!trimmedDishName) {
            showNotification("error", "料理名を入力してください");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (selectedIngIds.length === 0) {
            showNotification("error", "材料を1つ以上選択してください");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            await addDish(trimmedDishName, selectedIngIds);
            showNotification("success", "料理が追加されました");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setNewDishName('');
            setSelectedIngIds([]);
            navigate("/list_dish");
        } catch (error: any) {
            showNotification("error", error.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
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
            <h2>料理を追加</h2>
            <hr />
            <br />
            <form onSubmit={handleNewDish}>
                <h3>料理名を入力</h3>
                <p>新しい料理の名前を入力してください</p>
                <div className="input-area">
                    <Input
                        word={newDishName}
                        setWord={setNewDishName}
                        placeholder="料理名を入力"
                    />
                </div>
                <h3>材料を選択</h3>
                <p>必要な材料を全てチェックしてください</p>
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
                <div className='two-columns-container'>
                    {filteredIngData.map((ing: ingType) => (
                        <IngCardCheckboxType
                            key={ing.ing_id}
                            ing={ing}
                            catData={catData}
                            selectedIngIds={selectedIngIds}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ))}
                </div>
                <br />
                <button type="submit">追加</button>
            </form>
        </div>
    );
}

export default AddDish;