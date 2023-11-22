<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use Validator;
use Hash;
class UserController extends Controller
{   
    //Registration controller
    public function register(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $input = $request->all();
        $input['password'] = Hash::make($input['password']);
        $user = User::create($input);

        $success['token'] = $user->createToken('MyAPP')->plainTextToken;
        $success['name'] = $user->name;

        $response = [
            'success' => true,
            'data' => $success,
            'message' => 'User registered successfully',
        ];

        return response()->json($response, 200);
    } catch (\Exception $e) {
        $response = [
            'success' => false,
            'message' => 'Registration failed',
            'error' => $e->getMessage(),
        ];

        return response()->json($response, 400);
    }
}
    //Log in 
    public function login(Request $request){
        if(Auth::attempt(['email'=> $request->email, 'password' => $request->password])){
            $user = Auth::user();
            $success['token'] = $user->createToken('MyAPP')->plainTextToken;
            $success['user'] = $user;
            $response = [
                'success' => true,
                'data' => $success,
                'message' => "User login successfully"
            ];

        if ($response['success']) {
            // Store the token in the session
            session(['api_token' => $response['data']['token']]);
        }

            return response()->json($response,200);
            
        }
        else{
            $response = [
                'success' => false,
                'message' => "Unauthorized Access Denied"
            ];
        }
        return response()->json($response);
    }
}
