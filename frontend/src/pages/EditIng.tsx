import '../reset.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCat, getIng, editIng } from '../api/api.js';
import type { catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';

function EditIng() {
    const { ing_id } = useParams();
    // URLの動的な部分をオブジェクトで取得し，分割代入でing_idに代入．
    // (ex)ing_id = "2".

    const [editedIngName, setEditedIngName] = useState<string>('');
    const [editedIngCatId, setEditedIngCatId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
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
            setError('材料名を入力してください');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        if (!editedIngCatId) {
            setError('カテゴリーを選択してください');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        try {
            await editIng(Number(ing_id), trimmedEditedIngName, Number(editedIngCatId));
            setSuccessMessage('材料が正常に編集されました。');
            setEditedIngName('');
            setEditedIngCatId('');
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
            <h2>材料を編集</h2>
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