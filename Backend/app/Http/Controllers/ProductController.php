<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function showProducts(){
        $item = Product::get();

        return response()->json($item);
        
    }
}
