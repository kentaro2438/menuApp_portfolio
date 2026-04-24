import '../reset.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCat, getIng, editIng } from '../api/api.js';
import type { catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import { useNotification } from '../context/NotificationContext.tsx';

function EditIng() {
    const { ing_id } = useParams();
    // URLの動的な部分をオブジェクトで取得し，分割代入でing_idに代入．
    // (ex)ing_id = "2".
    const { showNotification } = useNotification();
    const [editedIngName, setEditedIngName] = useState<string>('');
    const [editedIngCatId, setEditedIngCatId] = useState<string>('');
    const [catData, setCatData] = useState<catType[]>([]);

    useEffect(() => {
        fetchGetCat();
        fetchGetIng();
    }, []);

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };

    //特定の材料を取得
    const fetchGetIng = async () => {
        const data = await getIng(Number(ing_id));
        setEditedIngName(data.ing_name);
        setEditedIngCatId(data.cat_id.toString());
    };

    const handleEditedIng = async (e: any) => {
        e.preventDefault();
        const trimmedEditedIngName = editedIngName.trim();
        if (!trimmedEditedIngName) {
            showNotification("error", "材料名を入力してください");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!editedIngCatId) {
            showNotification("error", "カテゴリーを選択してください");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        try {
            await editIng(Number(ing_id), trimmedEditedIngName, Number(editedIngCatId));
            showNotification("success", "材料が正常に編集されました。");
            setEditedIngName('');
            setEditedIngCatId('');
        } catch (error: any) {
            showNotification("error", error.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    };


    return (
        <div className="main edit-ing-page">
            <h2>材料を編集</h2>
            <hr />
            <br />
            <form onSubmit={handleEditedIng}>
                <div className="input-area">
                    <Input
                        word={editedIngName}
                        setWord={setEditedIngName}
                        placeholder="材料名を入力"
                    />
                    <Select
                        showCatId={editedIngCatId}
                        setShowCatId={setEditedIngCatId}
                        catData={catData}
                    />
                    <button type="submit">保存</button>
                </div>
            </form>
        </div>
    );
}

export default EditIng;