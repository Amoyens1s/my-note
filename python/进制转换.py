def DToR(m,r):
    t=''
    while m!=0 and r!=0:
        c=m % r    #求模
        if (c>9):
            t=chr(c-10+65)+t
        else:
            t=chr(c+48)+t
        m = m // r   #整除
    return t

while True:
    ipt=input()
    if ipt=='q':
        break
    r=int(input())
    rst=DToR(int(ipt),r)
    print('将%s转换为%d进制的结果为：%s' %(ipt,r,rst))
