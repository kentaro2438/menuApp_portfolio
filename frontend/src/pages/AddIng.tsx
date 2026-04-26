import '../reset.css';
import { useState, useEffect } from 'react';
import { getCat, addIng } from '../api/api.js';
import type { catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

function AddIng() {
    const { showNotification } = useNotification();
    const [catData, setCatData] = useState<catType[]>([]); //カテゴリー
    const [newIngName, setNewIngName] = useState<string>(''); //新しい材料名
    const [newIngCatId, setNewIngCatId] = useState<string>(''); //新しい材料のカテゴリーID
    const navigate = useNavigate();


    useEffect(() => {
        fetchGetCat();
    }, []);

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };

    const handleNewIng = async (e: any) => {
        e.preventDefault();
        const trimmednewIngName = newIngName.trim();
        if (!trimmednewIngName) {
            showNotification("error", "材料名を入力してください");
            return;
        }
        if (!newIngCatId) {
            showNotification("error", "カテゴリーを選択してください");
            return;
        }
        try {
            await addIng(trimmednewIngName, Number(newIngCatId));
            showNotification("success", "材料が追加されました");
            setNewIngName('');
            setNewIngCatId('');
            navigate("/list_ing");
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    };

    return (
        <div className="main add-ing-page">
            <h2>材料を追加</h2>
            <hr />
            <br />
            <form onSubmit={handleNewIng}>
                <div className="input-area">
                    <Input
                        word={newIngName}
                        setWord={setNewIngName}
                        placeholder="材料名を入力"
                    />
                    <Select
                        showCatId={newIngCatId}
                        setShowCatId={setNewIngCatId}
                        catData={catData}
                    />
                    <button type="submit"><Plus className='icon-in-main-btn' /> 追加</button>
                </div>
            </form>
        </div>
    );
}

export default AddIng;