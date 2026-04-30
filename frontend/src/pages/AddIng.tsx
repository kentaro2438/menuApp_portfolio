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
    const [catData, setCatData] = useState<catType[]>([]); 
    const [newIngName, setNewIngName] = useState<string>(''); 
    const [newIngCatId, setNewIngCatId] = useState<string>(''); 
    const [loading, setLoading] = useState<boolean>(false);
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
        setLoading(true);
        const trimmednewIngName = newIngName.trim();
        if (!trimmednewIngName) {
            showNotification("error", "材料名を入力してください");
            setLoading(false);
            return;
        }
        if (!newIngCatId) {
            showNotification("error", "カテゴリーを選択してください");
            setLoading(false);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main add-ing-page">
            <h2><Plus className='h2-icon'/> 材料を追加</h2>
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
                    <button type="submit" disabled={loading}>
                        {loading ? "追加中..." : <><Plus className='icon-in-main-btn' /> 追加</>}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddIng;