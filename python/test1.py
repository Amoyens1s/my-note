def isPrime(n):          # 定义判断素数的函数
    A=[]
    for i in range(n):
       while i>1:
           for m in range(2,i+1):
               if (i%m)!=0:
                   A.append(i)
       return A# 补充你的代码在这里
    
    
num = int(input()) # 接收用户输入并转成整数
s=isPrime(num)
print(s,end=" ")# 补充你的代码在这里