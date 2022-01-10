package il.ac.hit.example.application;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;



public class MainActivity extends AppCompatActivity {

    @SuppressLint("JavascriptInterface")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView view = new WebView(this);
        view.loadUrl("file:///android_asset/login.html");
        view.getSettings().setJavaScriptEnabled(true);

        view.setWebViewClient(new WebViewClient());

        view.getSettings().setDomStorageEnabled(true);

        view.getSettings().setAllowFileAccess(true);
       // view.getSettings().setBuiltInZoomControls(true);

       // IModelExpenseDAO modelExpenseDAO = ModelExpenseDAO.getInstance();
      //  view.addJavascriptInterface(modelExpenseDAO,"model");


        setContentView(view);

    }
}