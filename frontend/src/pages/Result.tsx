import '../reset.css';
import '../css/result.css';
import { Link, useLocation } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { addLackIngToShoppingList } from '../api/api';
import { useNotification } from '../context/NotificationContext';

type ResultItemType = [string, number, number, string[], number[], number];
// [料理名, 一致数, 不足数, 不足材料名リスト, 不足材料IDリスト, 一致率]

type LocationStateType = {
    selectedIngIds?: number[];
    resultList?: ResultItemType[];
};

function Result() {
    const location = useLocation();
    const state = location.state as LocationStateType | null;
    const selectedIngIds = state?.selectedIngIds || [];
    const resultList = state?.resultList || [];
    const { showNotification } = useNotification();

    const handleAddLackIngToShoppingList = async () => {
        try {
            await addLackIngToShoppingList(resultList.map((result) => result[4]).flat());
            showNotification("success", "不足している材料が買い物リストに追加されました");
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    };

    return (
        <div className="main result-page">
            <h2><ChefHat className='h2-icon' /> 検索結果</h2>
            <hr />
            <br />
            <p>選択した材料に基づいて検索された料理の結果です</p>
            <div className="input-area">
                <Link to="/search">
                    <button type="button">検索に戻る</button>
                </Link>
                <Link to="/refrigerator">
                    <button type="button">冷蔵庫に戻る</button>
                </Link>
            </div>
            <div>
                {selectedIngIds.length === 0 ? (
                    <p>検索する材料が選択されていません</p>
                ) : resultList.length === 0 ? (
                    <p>該当する料理が見つかりませんでした</p>
                ) : (
                    <div>
                        <p className='card-header'>検索結果一覧<span className='length'>{resultList.length}</span></p>
                        <div className="result-card-container">
                            {[...resultList]
                                .sort((a, b) => a[2] - b[2]) //不足数で昇順ソート
                                .map((result, index) => (
                                    <div key={index} className='result-card'>
                                        <h3 className='dish-name'>{result[0]}</h3>
                                        <div className="inner-wrap">
                                            <div>
                                                {result[2] === 0 ? (
                                                    <p className='is-lack-ing-name no-lack'>不足なし</p>
                                                ) : (
                                                    <div className='is-lack-ing-name'>
                                                        <div className='no-lack'>一致率</div> {result[5]}% <br />
                                                        <div className='is-lack-ing-name lack'>不足あり</div> {result[3].join("、")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='result-card-btn-container'>
                                            <button className='btn-add-shopping-list' onClick={handleAddLackIngToShoppingList}>買い物リストに追加</button>
                                            <a
                                                href={`https://www.google.com/search?q=${encodeURIComponent(result[0] + ' レシピ')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className='btn btn-main btn-recipe'
                                            >
                                                レシピを検索
                                            </a>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Result;