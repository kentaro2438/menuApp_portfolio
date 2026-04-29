import '../reset.css';
// import '../css/category.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCat, getAllIng, getDish, editDish } from "../api/api.js";
import type { catType, ingType } from "../types/type.ts";
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import IngCardCheckboxType from '../components/IngCardCheckboxType.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

function EditDish() {
    const { dish_id } = useParams();
    // URLの動的な部分をオブジェクトで取得し，分割代入でdish_idに代入．
    // (ex)dish_id = "2".
    const { showNotification } = useNotification();
    const [dishName, setDishName] = useState<string>("");
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]);
    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [showCatId, setShowCatId] = useState<string>("");
    const [dishMemo, setDishMemo] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
        fetchGetDish();
    }, []);

    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list_json);
    };

    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };

    const fetchGetDish = async () => {
        const data = await getDish(Number(dish_id));
        setDishName(data.dish_name);
        setDishMemo(data.dish_memo);
        setSelectedIngIds(data.ing_id_needed_list);
    }


    const handleCheckboxChange = (ingId: number) => {
        setSelectedIngIds((prev) => {
            if (prev.includes(ingId)) {
                return prev.filter((id) => id !== ingId);
            }
            return [...prev, ingId];
        });
    };

    const handleEditDish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedDishName = dishName.trim();

        if (!trimmedDishName) {
            showNotification("error", "料理名を入力してください");
            return;
        }

        if (selectedIngIds.length === 0) {
            showNotification("error", "材料を1つ以上選択してください");
            return;
        }

        try {
            await editDish(Number(dish_id), trimmedDishName, selectedIngIds, dishMemo);
            showNotification("success", "料理が編集されました");
            navigate('/list_dish');
        } catch (error: any) {
            showNotification("error", error.message);
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
        <div className="main edit-dish-page">
            <h2><Pencil className='h2-icon'/> 料理を編集</h2>
            <hr />
            <br />
            <form onSubmit={handleEditDish}>
                <h3>料理名を編集</h3>
                <hr />
                <div className="input-area">
                    <Input
                        word={dishName}
                        setWord={setDishName}
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
                <div>
                    <p className='card-header'>材料一覧<span className='length'>{filteredIngData.length}</span></p>
                    <div className="card-columns-container">
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
                        value={dishMemo}
                        onChange={(e) => setDishMemo(e.target.value)}
                        placeholder="メモを入力(任意)"
                    />
                <button type="submit">更新</button>
            </form>
        </div>
    );
}

export default EditDish;