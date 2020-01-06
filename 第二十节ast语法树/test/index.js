//解析sourceCode
//希望将sourceCode转换成
let tokens = [
    { type: "KeyWord", value: "let" },
    { type: "WhiteSpace", value: " " },
    { type: "Identifier", value: "name" },
    { type: "Equal", value: "=" },
    { type: "String", value: "zhangsan" }
]
let sourceCode = `let name='zhangsan'`
let newTokens = [];
for (let i = 0; i < sourceCode.length; i++) {
    let ch = sourceCode.charAt(i);
    //判断类型
    //简化关键字和标识符只能是字母
    //可能是关键字或是标识符
    console.log("ch===>", ch, /\s/.test(ch));
    if (/[a-z]/.test(ch)) {
        let token = { type: "Identifier", value: ch }
        //这个循环只是寻找 关键字/标识符
        //循环的目的是找接下来连续的字符,判读是否满足要求
        for (i++; i < sourceCode.length; i++) {
            ch = sourceCode.charAt(i);
            if (/[a-z]/.test(ch)) {
                //满足要求,是连续的字母
                token.value += ch;
            } else {
                //如果不满足呢,说明标识符或是关键字已结束
                //寻找标识符或是关键字的任务已结束
                if (token.value === 'let' || token.value === 'var') {
                    token.type = "KeyWord";
                }
                newTokens.push(token);
                break;
            }
        }
        i--;
        continue;
    } else if (/\s/.test(ch)) {
        //空格可能有多个,所以需要连续找
        let token = { type: "WhiteSpace", value: ch };
        for (i++; i < sourceCode.length; i++) {
            ch = sourceCode.charAt(i);
            if (/\s/.test(ch)) {
                //如果还是空格说明是连续空格
                token.value += ch;
            } else {
                //空格结束
                newTokens.push(token);
                break;
            }
        }
        i--;
        continue;
    } else if (/[=]/.test(ch)) {
        let token = { type: "Equal", value: ch };
        newTokens.push(token);
    } else if (ch == '"' || ch == "'") {
        //如果是双引号或是单引号 说明是字符串
        let token = { type: "String", value: ch };
        newTokens.push(token);
        for (i++; i < sourceCode.length; i++) {
            ch = sourceCode.charAt(i);
            if (ch == '"' || ch == "'") {
                //匹配结束
                token.value += ch;
                break;
            } else {
                //匹配还在有
                token.value += ch;
                
            }
        }
        // i--;
        continue;
    }
}
console.log("newTokens==>", newTokens);
