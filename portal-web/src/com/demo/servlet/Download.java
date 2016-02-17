package com.demo.servlet;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Download extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public Download() {
		super();
	}

	public void doGet( HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException {
		String filepath = request.getParameter( "filecode" );
		String path = request.getRealPath( "upload/" + filepath );
		System.out.println( path );
		try {
			downLoad( path, response, true );
		}
		catch( Exception e ) {
			e.printStackTrace();
		}
	}

	public void downLoad( String filePath, HttpServletResponse response, boolean isOnLine ) throws Exception {
		File f = new File( filePath );
		if( !f.exists() ) {
			response.sendError( 404, "File not found!" );
			return;
		}
		BufferedInputStream br = new BufferedInputStream( new FileInputStream( f ) );
		byte[] buf = new byte[1024];
		int len = 0;

		response.reset();
		// 非常重要
		if( isOnLine ) {
			// 在线打开方式
			URL u = new URL( "file:///" + filePath );
			response.setContentType( u.openConnection().getContentType() );
			response.setHeader( "Content-Disposition", "inline; filename=" + f.getName() );
			// 文件名应该编码成UTF-8
		}
		else {
			// 纯下载方式
			response.setContentType( "application/x-msdownload" );
			response.setHeader( "Content-Disposition", "attachment; filename=" + f.getName() );
		}
		OutputStream out = response.getOutputStream();
		while( (len = br.read( buf )) > 0 )
			out.write( buf, 0, len );
		br.close();
		out.close();
	}

}
