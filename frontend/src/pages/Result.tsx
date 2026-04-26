import '../reset.css';
import { Link, useLocation } from "react-router-dom";

type ResultItemType = [string, number, number, string[]];

type LocationStateType = {
    selectedIngIds?: number[];
    resultList?: ResultItemType[];
};

function Result() {
    const location = useLocation();
    const state = location.state as LocationStateType | null;

    const selectedIngIds = state?.selectedIngIds || [];
    const resultList = state?.resultList || [];

    return (
        <div className="main result-page">
            <h2>検索結果</h2>
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
                                                    <span className='lack'>不足あり</span>: {result[3].join("、")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(result[0] + ' レシピ')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='btn btn-main btn-recipe'
                                    >
                                        レシピを検索
                                    </a>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Result;