package com.baraka.pwa;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.telephony.SmsManager;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class SmsService extends Service {

    private static final String CHANNEL_ID = "BarakaSMSChannel";
    private static final int PORT = 8765;
    private ServerSocket serverSocket;
    private boolean running = true;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        startForeground(1, buildNotification());
        startSmsServer();
    }

    private void startSmsServer() {
        new Thread(() -> {
            try {
                serverSocket = new ServerSocket(PORT);
                Log.d("BarakaSMS", "Service started on port " + PORT);
                while (running) {
                    Socket client = serverSocket.accept();
                    handleClient(client);
                }
            } catch (Exception e) {
                Log.e("BarakaSMS", "Server error: " + e.getMessage());
            }
        }).start();
    }

    private void handleClient(Socket client) {
        new Thread(() -> {
            try {
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(client.getInputStream()));
                StringBuilder requestBuilder = new StringBuilder();
                String line;
                int contentLength = 0;

                while ((line = reader.readLine()) != null && !line.isEmpty()) {
                    if (line.startsWith("Content-Length:")) {
                        contentLength = Integer.parseInt(line.split(":")[1].trim());
                    }
                }

                char[] body = new char[contentLength];
                reader.read(body, 0, contentLength);
                String jsonBody = new String(body);

                JSONObject json = new JSONObject(jsonBody);
                String phone = json.getString("phone");
                String message = json.getString("message");

                sendSms(phone, message);

                String response = "{\"success\":true}";
                OutputStream out = client.getOutputStream();
                out.write(("HTTP/1.1 200 OK\r\n" +
                        "Content-Type: application/json\r\n" +
                        "Access-Control-Allow-Origin: *\r\n" +
                        "Content-Length: " + response.length() + "\r\n\r\n" +
                        response).getBytes());
                out.flush();
                client.close();

            } catch (Exception e) {
                Log.e("BarakaSMS", "Client error: " + e.getMessage());
            }
        }).start();
    }

    private void sendSms(String phone, String message) {
        try {
            SmsManager smsManager;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                smsManager = getSystemService(SmsManager.class);
            } else {
                smsManager = SmsManager.getDefault();
            }
            java.util.ArrayList<String> parts = smsManager.divideMessage(message);
            smsManager.sendMultipartTextMessage(phone, null, parts, null, null);
            Log.d("BarakaSMS", "SMS sent to " + phone);
        } catch (Exception e) {
            Log.e("BarakaSMS", "SMS error: " + e.getMessage());
        }
    }

    private Notification buildNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("جمعية البركة")
                .setContentText("خدمة SMS تعمل في الخلفية")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, "Baraka SMS Service",
                    NotificationManager.IMPORTANCE_LOW);
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        running = false;
        try {
            if (serverSocket != null) serverSocket.close();
        } catch (Exception e) {
            Log.e("BarakaSMS", "Error: " + e.getMessage());
        }
    }
}
