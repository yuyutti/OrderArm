## OrderArm

## サーバー作成時の右腕BOTです

【利用方法】
1. git cloneなりでダウンロード
2. .env.exampleを参考に.envファイルを作成
3. node index.js

DiscordDeveloper側でMESSAGE CONTENT INTENTの有効化は必須です  
ワンちゃんそれ以外もいるかもだけど多分要らん

### コマンド

・clear {channelId}  
引数: channelId = チャンネルID  
指定したチャンネルのメッセージをすべて削除します。  
※BOTの制約上14日以内の物しか削除できません。

・d {categoryId}  
引数: categoryId = カテゴリーID  
指定したカテゴリー内のチャンネルをすべて削除します。

・createVCs {categoryId} {channelNameTemplate} {countStart} {countEnd}  
引数:  
categoryId = カテゴリID  
channelNameTemplate = 作成するチャンネル名  
※${i}という文字を含めば連番で作成可能  
countStart = 連番で作成するときの初めの数  
countEnd = 連番で作成するときの最後の数  
※ countStart ~ countEndまでの数がVCの作成数になります  
※ Discordの仕様上同じカテゴリには50チャンネルまでしか作成できません
指定したカテゴリー内に指定した数VCを作成します。

・set {categoryId} {userLimit}  
引数:
categoryId = カテゴリーID  
userLimit = VCの人数制限数  
指定されたカテゴリー内の全てのVCチャンネルの人数制限を行います。