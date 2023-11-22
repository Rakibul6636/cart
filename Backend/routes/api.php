<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AdminCartController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(UserController::class)->group(function(){
    Route::any('login','login')->name('login');
    Route::any('register','register')->name('register');
});
//Route::any('register',[UserController::class,'register']);

Route::resource('users',UserController::class);

Route::get('products',[ProductController::class,'showProducts']);

Route::group(['middleware' => ['auth:sanctum']], function () {
 Route::get('test',[CartController::class,'index']);
 Route::get('viewCart',[CartController::class,'index']);
 Route::post('addToCart',[CartController::class,'addToCart']);
 Route::put('removeCartItem/{cartItem}',[CartController::class,'removeCartItem']);
 Route::delete('removeFromCart/{cartItem}', [CartController::class, 'removeFromCart']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Admin routes
    Route::get('/admin/dashboard', [AdminCartController::class, 'viewCartForAdmin']);
    Route::post('/admin/status/{cart}', [AdminCartController::class, 'setOrderStatus']);
});