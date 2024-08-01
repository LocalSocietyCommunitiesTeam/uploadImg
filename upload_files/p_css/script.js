/* 画面個別JavaScript */
window.addEventListener('DOMContentLoaded', function () {
    // 要素を取得
    const uploadBtn = document.getElementById('pt_uploadBtn'); // アップロードボタン
    const confirmBtn = document.getElementById('pt_confirmBtn'); // 確定ボタン
    const cancelBtn = document.getElementById('pt_cancelBtn'); // キャンセルボタン

    // 画像アップロード時の処理
    uploadBtn.addEventListener('change', function () {
        // アップロードされたファイルを取得
        const file = this.files[0];

        if (file) {
            // 画像を読み込む
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // キャンバスを作成し、画像を描画
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const canvasArea = document.getElementById('pt_canvasArea');
                    canvasArea.appendChild(canvas);

                    // WebP形式に変換
                    canvas.toBlob((blob) => {
                        console.log('blob: ' + blob);

                        // 要素を取得
                        const uploadImg = document.getElementById('pt_uploadImg'); // アップロード画像
                        const uploadBtn = document.getElementById('pt_uploadBtn'); // アップロードボタン
                        const confirmBtn = document.getElementById('pt_confirmBtn'); // 確定ボタン
                        const cancelBtn = document.getElementById('pt_cancelBtn'); // キャンセルボタン
                        
                        // BlobをURLに変換
                        const url = URL.createObjectURL(blob);
                        console.log('url: ' + url);

                        // 画像表示要素のsrc属性を変更
                        uploadImg.src = url;

                        // キャンバスを非表示
                        canvas.classList.add('pt_hiddenFlg');

                        // ボタンの表示切り替え
                        uploadImg.classList.remove('pt_hiddenFlg');
                        uploadImg.previousElementSibling.classList.add('pt_hiddenFlg');
                        uploadBtn.parentElement.classList.add('pt_hiddenFlg');
                        confirmBtn.classList.remove('pt_hiddenFlg');
                        cancelBtn.classList.remove('pt_hiddenFlg');
                    }, 'image/webp');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 確定ボタン押下時の処理
    confirmBtn.addEventListener('click', function () {
        // 要素を取得
        const uploadBtn = document.getElementById('pt_uploadBtn'); // アップロードボタン

        // アップロード画像を取得
        const file = uploadBtn.files[0];

        // ファイルをサーバーにアップロード
        uploadImg(file);
    });

    // キャンセルボタン押下時の処理
    cancelBtn.addEventListener('click', function () {
        // 要素を取得
        const preImg = document.getElementsByClassName('pt_preImg')[0]; // プリイメージ
        const uploadImg = document.getElementById('pt_uploadImg'); // アップロード画像
        const uploadBtn = document.getElementById('pt_uploadBtn'); // アップロードボタン
        const confirmBtn = document.getElementById('pt_confirmBtn'); // 確定ボタン

        // プリイメージを表示
        preImg.classList.remove('pt_hiddenFlg');
        // アップロード画像を非表示
        uploadImg.src = '';
        uploadImg.classList.add('pt_hiddenFlg');
        // アップロードボタンのファイルを削除
        uploadBtn.value = '';
        // アップロードボタンを表示
        uploadBtn.parentElement.classList.remove('pt_hiddenFlg');
        // 確定ボタンを非表示
        confirmBtn.classList.add('pt_hiddenFlg');
        // キャンセルボタンを非表示
        this.classList.add('pt_hiddenFlg');
    });
});

// 非同期で画像をサーバーにアップロードする関数
async function uploadImg(file) {
    // ローダーを表示
    showLoader();

    // 要素を取得
    const uploadSec = document.getElementsByClassName('pt_uploadSec')[0]; // アップロードセクション
    const completeSec = document.getElementsByClassName('pt_completeSec')[0]; // 完了セクション

    try {
        // 画像データを送信
        const response = await fetch(
            'APIのURL',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/image"
                },
                body: file,
                timeout: 8000
            }
        );

        // アップロードセクションを非表示
        uploadSec.classList.add('pt_hiddenFlg');

        // 完了セクションを表示
        completeSec.classList.remove('pt_hiddenFlg');

        return response;
    } catch (e) {
        console.error(e.message);
        window.alert('通信に失敗しました。\n\n' + e.message);
    } finally {
        // ローダーを非表示
        closeLoader();
    }
}

// ローダーを表示する関数
function showLoader() {
    // 要素を取得
    const loader = document.getElementsByClassName('pt_loader')[0]; // ローダー

    // ローダーを表示
    loader.classList.remove('pt_loader_hidden');
}

// ローダーを非表示にする関数
function closeLoader() {
    // 要素を取得
    const loader = document.getElementsByClassName('pt_loader')[0]; // ローダー

    // ローダーを非表示
    loader.classList.add('pt_loader_hidden');
}

// 画像をWebPに変換する関数
function convertToWebp(canvas) {
    const dataURL = canvas.toDataURL('image/webp');
    return dataURL;
}
