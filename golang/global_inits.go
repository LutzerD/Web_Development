package main


import "fmt"


//illegal
//var g_a, g_b := "butts", "nutts"


//legal
var g_a, g_b string = "butts", "nutts"

func main(){
  fmt.Println(g_a,g_b)
}


