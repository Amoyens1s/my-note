#定义lambda函数getLastBit返回一个数的个位数
getLastBit= lambda x: x%10

#定义一个可变参数的函数makeNumber，求任意个整数的个位数构成的一个新整数
def makeNumber(a,*b):
        result = []
        for i in b[0]:
            result.append(str(getLastBit(i)))
        return int("".join(result))

#输入一组逗号分隔的数，截取个位数构成的新整数。
t=eval(input())
print("新整数是%d"%makeNumber(0, t))