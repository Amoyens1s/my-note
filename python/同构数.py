def isTGS(n):
        a = str(n)
        b = str(pow(n, 2))
        return b[-len(a):] == a
def getTGS():
        L=[]
        s=input().strip()
        while s!="-1":
                if 0<len(s)<=2  and s.isdigit():
                        n=int(s)
                        if n>0 and isTGS(n):
                                L.append(n)
                s=input().strip()
        return L
def main():
        L=getTGS()
        if len(L)==0:
            print("没有同构数")
        else:
            L.sort()
            print("同构数有：",end="")
            L=[str(i) for i in L]
            print(*L, end=' ')
if __name__ == '__main__':
    main()