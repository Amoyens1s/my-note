#计算每一个预选赛跳高比赛小组中能进入初赛的成绩，初赛资格线：142
groups=(
(78,150,90,102,110,141),        #第一组
(149,88,132,95,108,112,143),    #第二组
(100,123,125,99,106,118,133),
(152,86,132,95,70,122,149,124),
)
def passList(scores,lowlimit):
    L=[]
    a=list(scores)
    for i in a:
        if i>=lowlimit:
            L.append(i)
    return L
def main():
    b=list(groups)
    s=[]
    print("获得初赛资格的成绩")
    for m in range(0, len(b)):
        s.append(passList(groups[m],142))
        if s[m]:
            s2 = " ".join(str(i) for i in s[m])
            print("第{}组:	{} ".format(m+1,s2))
        else:
            print("第{}组:	{}".format(m+1, ''))
        
        
    
main()
