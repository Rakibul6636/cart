<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;

class AdminCartController extends Controller
{
    //show all users carts for admin only.
    public function viewCartForAdmin()
    {
        $carts = Cart::with('cartItems.product')->get();

        return response()->json(['carts' => $carts]);
    }
    //Update the cart status.
    public function setOrderStatus(Request $request, Cart $cart)
    {
        $request->validate([
            'status' => 'required|in:open,completed,canceled',
        ]);

        $cart->update(['status' => $request->input('status')]);

        return response()->json(['message' => 'Order status updated successfully']);
    }
}
